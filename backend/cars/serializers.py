from .models import Car, Feature, Brand, CarImage, Booking, Review, Wishlist
from rest_framework import serializers

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']
        
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'image']
        
class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image']

class CarSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    brand = BrandSerializer(read_only=True)
    images = CarImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()  
    
    class Meta:
        model = Car
        fields = '__all__'
        



class BookingSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.IntegerField(write_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 
            'user', 
            'user_username',
            'car', 
            'car_id',
            'pickup_date', 
            'return_date', 
            'total_days', 
            'total_cost', 
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Automatically set the user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    car_name = serializers.CharField(source='car.name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_username', 'car', 'car_name', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Automatically set the user from request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class WishlistSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'car', 'car_id', 'created_at']
        read_only_fields = ['user', 'created_at']