from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
from .serializers import CarSerializer, FeatureSerializer, BrandSerializer, BookingSerializer, ReviewSerializer, WishlistSerializer, ContactMessageSerializer, NewsletterSerializer
from .models import Car, Feature, Brand, Booking, Review, Wishlist, ContactMessage, Newsletter
from .emails import send_booking_confirmation_email, send_booking_cancellation_email 


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Car.objects.filter(featured=True)
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def check_availability(self, request, pk=None):
        """Check if car is available for given dates"""
        car = self.get_object()
        pickup_date = request.data.get('pickup_date')
        return_date = request.data.get('return_date')
        
        if not pickup_date or not return_date:
            return Response({
                'error': 'Both pickup_date and return_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convert strings to date objects
            pickup = datetime.strptime(pickup_date, '%Y-%m-%d').date()
            return_dt = datetime.strptime(return_date, '%Y-%m-%d').date()
            
            # Check if dates are valid
            if return_dt <= pickup:
                return Response({
                    'available': False,
                    'error': 'Return date must be after pickup date'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for overlapping bookings
            # A booking overlaps if:
            # 1. It starts before our return date AND
            # 2. It ends after our pickup date
            overlapping_bookings = Booking.objects.filter(
                car=car,
                status__in=['pending', 'confirmed']  # Only active bookings
            ).filter(
                Q(pickup_date__lt=return_dt) & Q(return_date__gt=pickup)
            )
            
            is_available = not overlapping_bookings.exists()
            
            if is_available:
                return Response({
                    'available': True,
                    'message': 'Car is available for selected dates'
                })
            else:
                # Get conflicting booking details
                conflicting = overlapping_bookings.first()
                return Response({
                    'available': False,
                    'message': 'Car is not available for selected dates',
                    'conflicting_booking': {
                        'pickup_date': conflicting.pickup_date,
                        'return_date': conflicting.return_date
                    }
                })
                
        except ValueError:
            return Response({
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    
        

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    # GET /api/brands/by_brand/?brand_id=1
    @action(detail=False, methods=['get'])
    def by_brand(self, request):
        brand_id = request.query_params.get('brand_id')

        if brand_id:
            cars = Car.objects.filter(brand_id=brand_id)
            serializer = CarSerializer(cars, many=True)
            return Response(serializer.data)

        return Response({'error': 'brand_id required'}, status=400)
    
class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in
    
    def get_queryset(self):
        # Users can only see their own bookings
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        
        # Send confirmation email
        if booking.user.email:
            send_booking_confirmation_email(booking)
            
    def partial_update(self, request, *args, **kwargs):
        booking = self.get_object()
        old_status = booking.status
        
        # Update booking
        response = super().partial_update(request, *args, **kwargs)
        
        # If status changed to cancelled, send cancellation email
        new_status = request.data.get('status')
        if old_status != 'cancelled' and new_status == 'cancelled':
            if booking.user.email:
                send_booking_cancellation_email(booking)
        
        return response
    
    

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Anyone can read, only authenticated can write
    
    def get_queryset(self):
        # Filter reviews by car_id if provided
        car_id = self.request.query_params.get('car_id')
        if car_id:
            return Review.objects.filter(car_id=car_id)
        return Review.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        # Only allow users to update their own reviews
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own reviews")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only allow users to delete their own reviews
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own reviews")
        instance.delete()
        
        
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own wishlist
        return Wishlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the user
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Check if already in wishlist
        car_id = request.data.get('car_id')
        if Wishlist.objects.filter(user=request.user, car_id=car_id).exists():
            return Response({
                'error': 'Car already in wishlist'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['delete'])
    def remove_by_car(self, request):
        """Remove car from wishlist by car_id"""
        car_id = request.query_params.get('car_id')
        
        if not car_id:
            return Response({
                'error': 'car_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, car_id=car_id)
            wishlist_item.delete()
            return Response({'message': 'Removed from wishlist'})
        except Wishlist.DoesNotExist:
            return Response({
                'error': 'Car not in wishlist'
            }, status=status.HTTP_404_NOT_FOUND)
            
            
            

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message(request):
    """Handle contact form submissions"""
    serializer = ContactMessageSerializer(data=request.data)
    
    if serializer.is_valid():
        contact = serializer.save()
        
        # Send email to admin
        try:
            send_mail(
                subject=f'New Contact Message: {contact.subject}',
                message=f'From: {contact.name} ({contact.email})\n\nMessage:\n{contact.message}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            
            # Send confirmation email to user
            send_mail(
                subject='We received your message!',
                message=f'Hi {contact.name},\n\nThank you for contacting AutoHire. We have received your message and will get back to you soon.\n\nBest regards,\nAutoHire Team',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Email error: {e}")
        
        return Response({
            'message': 'Thank you for your message! We will get back to you soon.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def newsletter_subscribe(request):
    """Handle newsletter subscriptions"""
    serializer = NewsletterSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Check if already subscribed
        if Newsletter.objects.filter(email=email).exists():
            return Response({
                'message': 'This email is already subscribed to our newsletter.'
            }, status=status.HTTP_200_OK)
        
        newsletter = serializer.save()
        
        # Send welcome email
        try:
            send_mail(
                subject='Welcome to AutoHire Newsletter!',
                message=f'Thank you for subscribing to AutoHire newsletter!\n\nYou will receive updates about our latest cars, special offers, and news.\n\nBest regards,\nAutoHire Team',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Email error: {e}")
        
        return Response({
            'message': 'Successfully subscribed to our newsletter!'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)