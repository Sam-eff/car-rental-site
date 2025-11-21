import stripe
from django.conf import settings
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Booking

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """Create Stripe checkout session for booking payment"""
    try:
        booking_id = request.data.get('booking_id')
        
        if not booking_id:
            return Response({'error': 'Booking ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get booking
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already paid
        if booking.payment_status == 'succeeded':
            return Response({'error': 'Booking already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create Stripe checkout session
        frontend_url = request.data.get('frontend_url', 'http://localhost:5173')
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': int(float(booking.total_cost) * 100),  # Amount in cents
                    'product_data': {
                        'name': f'Car Rental: {booking.car.name}',
                        'description': f'Rental from {booking.pickup_date} to {booking.return_date} ({booking.total_days} days)',
                        # 'images': [booking.car.image if booking.car.image and booking.car.image.startswith('http') else ''],
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{frontend_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{frontend_url}/payment/cancel?booking_id={booking.id}',
            client_reference_id=str(booking.id),
            metadata={
                'booking_id': booking.id,
                'user_id': request.user.id,
            }
        )
        
        # Save session ID
        booking.stripe_session_id = session.id
        booking.payment_status = 'processing'
        booking.save()
        
        return Response({
            'session_id': session.id,
            'url': session.url
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """Verify payment after successful checkout"""
    try:
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Get booking
        booking_id = session.metadata.get('booking_id')
        booking = Booking.objects.get(id=booking_id, user=request.user)
        
        if session.payment_status == 'paid':
            # Update booking
            booking.payment_status = 'succeeded'
            booking.status = 'confirmed'
            booking.payment_intent_id = session.payment_intent
            booking.save()
            
            return Response({
                'message': 'Payment successful',
                'booking': {
                    'id': booking.id,
                    'status': booking.status,
                    'payment_status': booking.payment_status
                }
            })
        else:
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stripe_public_key(request):
    """Get Stripe publishable key for frontend"""
    return Response({
        'publishable_key': settings.STRIPE_PUBLISHABLE_KEY
    })