from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField


# Create your models here.


CarType = [
    ("SUV", "SUV"),
    ("Hatchback", "Hatchback"),
    ("Sedan", "Sedan"),
]

Transmission = [
    ("Automatic", "Automatic"),
    ("Manual", "Manual"),
]

FuelType = [
    ("Petrol", "Petrol"),
    ("Diesel", "Diesel"),
    ("Electric", "Electric"),
]


class Feature(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Brand(models.Model):
    name = models.CharField(max_length=255)
    image = CloudinaryField('image', folder='cars/related/')
    
    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    

class Car(models.Model):
    name = models.CharField(max_length=255)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    year = models.IntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    car_type = models.CharField(max_length=255, choices=CarType)
    description = models.TextField()
    transmission = models.CharField(max_length=255, choices=Transmission)
    fuel_type = models.CharField(max_length=255, choices=FuelType)
    image = CloudinaryField('image', folder='cars/', blank=True, null=True)
    color = models.CharField(max_length=255, blank=True)
    license_plate = models.CharField(max_length=255, blank=True)
    features = models.ManyToManyField(Feature, related_name='cars')
    speed = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    time = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    horsepower = models.IntegerField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-featured']
    

    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        """Calculate average rating for this car"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    @property
    def review_count(self):
        """Get total number of reviews"""
        return self.reviews.count()
    

class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', folder='cars/related/')
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.car.name} - {self.caption or 'Image'}"
    

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    pickup_date = models.DateField()
    return_date = models.DateField()
    total_days = models.IntegerField()
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment fields 
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.car.name} ({self.pickup_date} to {self.return_date})"
    


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        # One review per user per car
        unique_together = ['user', 'car']
    
    def __str__(self):
        return f"{self.user.username} - {self.car.name} ({self.rating}★)"
    


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'car']  # User can only wishlist a car once
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.car.name}"