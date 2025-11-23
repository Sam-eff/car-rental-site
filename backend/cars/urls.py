from django.urls import path, include
from .views import CarViewSet, FeatureViewSet, BrandViewSet, BookingViewSet, ReviewViewSet, WishlistViewSet
from . import payments, admin_views, views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    
    path('contact/', views.contact_message, name='contact-message'),
    path('newsletter/', views.newsletter_subscribe, name='newsletter-subscribe'),
    
    # payment endpoints
    path('payments/create-checkout-session/', payments.create_checkout_session, name='create_checkout_session'),
    path('payments/verify/', payments.verify_payment, name='verify_payment'),
    path('payments/public-key/', payments.get_stripe_public_key, name='stripe_public_key'),
    
    # Admin endpoints 
    path('admin/stats/', admin_views.admin_stats, name='admin_stats'),
    path('admin/bookings/', admin_views.admin_all_bookings, name='admin_all_bookings'),
    path('admin/bookings/<int:booking_id>/status/', admin_views.admin_update_booking_status, name='admin_update_booking_status'),
    path('admin/users/', admin_views.admin_all_users, name='admin_all_users'),
    path('admin/revenue/', admin_views.admin_revenue_chart, name='admin_revenue_chart'),
]