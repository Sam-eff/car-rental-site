from django.contrib import admin

# Register your models here.

from .models import Car, Feature, CarImage, Brand, Booking, Review, Wishlist

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'price_per_day', 'car_type', 'transmission', 'fuel_type', 'color', 'license_plate', 'is_available', 'featured')
    list_filter = ['featured']

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name',)
    
@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ('car', 'image', 'caption')
    
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'pickup_date', 'return_date')
    
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'rating', 'comment')
    
@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'car')