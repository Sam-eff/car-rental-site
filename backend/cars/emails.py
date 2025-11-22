from django.core.mail import send_mail
from django.conf import settings

def send_booking_confirmation_email(booking):
    """Send booking confirmation email to user"""
    subject = f'Booking Confirmation - {booking.car.name}'
    
    # Plain text message (no template)
    message = f"""
    Dear {booking.user.username},
    
    Your booking has been confirmed!
    
    Booking Details:
    ----------------
    Car: {booking.car.name}
    Pickup Date: {booking.pickup_date}
    Return Date: {booking.return_date}
    Total Days: {booking.total_days}
    Total Cost: ${booking.total_cost}
    Booking Status: {booking.status}
    
    Thank you for choosing Autohire!
    
    Best regards,
    The Autohire Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.user.email],
            fail_silently=True,  # Change to True to suppress errors
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_booking_cancellation_email(booking):
    """Send booking cancellation email to user"""
    subject = f'Booking Cancelled - {booking.car.name}'
    
    message = f"""
    Dear {booking.user.username},
    
    Your booking has been cancelled.
    
    Cancelled Booking Details:
    -------------------------
    Car: {booking.car.name}
    Pickup Date: {booking.pickup_date}
    Return Date: {booking.return_date}
    Total Cost: ${booking.total_cost}
    
    If you didn't request this cancellation, please contact us immediately.
    
    We hope to serve you again soon!
    
    Best regards,
    The Autohire Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.user.email],
            fail_silently=True,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_welcome_email(user):
    """Send welcome email to newly registered user"""
    subject = 'Welcome to Autohire!'
    
    message = f"""
    Dear {user.username},
    
    Welcome to Autohire - Your Premium Car Rental Service!
    
    Thank you for creating an account with us.
    
    What's Next?
    -----------
    1. Browse our fleet of premium vehicles
    2. Select your preferred car
    3. Choose your rental dates
    4. Complete your booking
    
    Happy travels!
    
    Best regards,
    The Autohire Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False