from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Count, Sum, Q, Avg
from django.utils import timezone
from datetime import timedelta
from .models import Car, Booking, Review, Brand
from .serializers import BookingSerializer, CarSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """Get dashboard statistics for admin"""
    
    # Total counts
    total_cars = Car.objects.count()
    total_users = User.objects.filter(is_staff=False).count()
    total_bookings = Booking.objects.count()
    total_revenue = Booking.objects.filter(
        payment_status='succeeded'
    ).aggregate(total=Sum('total_cost'))['total'] or 0
    
    # Active bookings (confirmed and not yet completed)
    active_bookings = Booking.objects.filter(
        status__in=['pending', 'confirmed'],
        return_date__gte=timezone.now().date()
    ).count()
    
    # Recent bookings (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_bookings = Booking.objects.filter(
        created_at__gte=thirty_days_ago
    ).count()
    
    # Revenue this month
    first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = Booking.objects.filter(
        payment_status='succeeded',
        created_at__gte=first_day_of_month
    ).aggregate(total=Sum('total_cost'))['total'] or 0
    
    # Most popular cars
    popular_cars = Car.objects.annotate(
        booking_count=Count('bookings')
    ).order_by('-booking_count')[:5]
    
    popular_cars_data = [{
        'id': car.id,
        'name': car.name,
        'bookings': car.booking_count,
        'revenue': Booking.objects.filter(
            car=car, 
            payment_status='succeeded'
        ).aggregate(total=Sum('total_cost'))['total'] or 0
    } for car in popular_cars]
    
    # Booking status breakdown
    status_breakdown = {
        'pending': Booking.objects.filter(status='pending').count(),
        'confirmed': Booking.objects.filter(status='confirmed').count(),
        'cancelled': Booking.objects.filter(status='cancelled').count(),
        'completed': Booking.objects.filter(status='completed').count(),
    }
    
    # Recent reviews
    recent_reviews = Review.objects.select_related('user', 'car').order_by('-created_at')[:5]
    reviews_data = [{
        'id': review.id,
        'user': review.user.username,
        'car': review.car.name,
        'rating': review.rating,
        'comment': review.comment[:100],
        'created_at': review.created_at
    } for review in recent_reviews]
    
    return Response({
        'overview': {
            'total_cars': total_cars,
            'total_users': total_users,
            'total_bookings': total_bookings,
            'total_revenue': float(total_revenue),
            'active_bookings': active_bookings,
            'recent_bookings': recent_bookings,
            'monthly_revenue': float(monthly_revenue)
        },
        'popular_cars': popular_cars_data,
        'status_breakdown': status_breakdown,
        'recent_reviews': reviews_data
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_bookings(request):
    """Get all bookings for admin with filters"""
    
    # Get query parameters for filtering
    status_filter = request.query_params.get('status')
    user_id = request.query_params.get('user_id')
    car_id = request.query_params.get('car_id')
    
    bookings = Booking.objects.select_related('user', 'car').all()
    
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    if user_id:
        bookings = bookings.filter(user_id=user_id)
    if car_id:
        bookings = bookings.filter(car_id=car_id)
    
    bookings = bookings.order_by('-created_at')
    
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_booking_status(request, booking_id):
    """Update booking status (admin only)"""
    try:
        booking = Booking.objects.get(id=booking_id)
        new_status = request.data.get('status')
        
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = new_status
        booking.save()
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
        
    except Booking.DoesNotExist:
        return Response({
            'error': 'Booking not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_users(request):
    """Get all users for admin"""
    users = User.objects.filter(is_staff=False).annotate(
        booking_count=Count('bookings'),
        total_spent=Sum('bookings__total_cost', filter=Q(bookings__payment_status='succeeded'))
    ).order_by('-date_joined')
    
    users_data = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
        'booking_count': user.booking_count,
        'total_spent': float(user.total_spent or 0),
        'is_active': user.is_active
    } for user in users]
    
    return Response(users_data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_revenue_chart(request):
    """Get revenue data for charts (last 12 months)"""
    from datetime import datetime
    from dateutil.relativedelta import relativedelta
    
    today = timezone.now().date()
    twelve_months_ago = today - relativedelta(months=12)
    
    # Get monthly revenue
    bookings = Booking.objects.filter(
        payment_status='succeeded',
        created_at__gte=twelve_months_ago
    )
    
    monthly_data = {}
    for i in range(12):
        month_date = today - relativedelta(months=i)
        month_key = month_date.strftime('%Y-%m')
        month_bookings = bookings.filter(
            created_at__year=month_date.year,
            created_at__month=month_date.month
        )
        monthly_data[month_key] = {
            'revenue': float(month_bookings.aggregate(total=Sum('total_cost'))['total'] or 0),
            'bookings': month_bookings.count()
        }
    
    # Sort by date
    sorted_data = dict(sorted(monthly_data.items()))
    
    return Response(sorted_data)