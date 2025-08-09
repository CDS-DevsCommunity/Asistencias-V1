import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8001"

def test_endpoints():
    print("🧪 Testing Django Job Management API")
    print("=" * 50)
    
    # Test 1: Health check - Try to access Swagger
    try:
        response = requests.get(f"{BASE_URL}/swagger/")
        print(f"✅ Swagger UI: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Swagger UI Error: {e}")
    
    # Test 2: Try to register a user
    try:
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register/", 
                               json=register_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 201:
            print(f"✅ User Registration: Status {response.status_code}")
            data = response.json()
            access_token = data.get('access')
            print(f"🔑 Access Token received: {access_token[:20]}...")
            
            # Test 3: Try to access protected endpoint with token
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(f"{BASE_URL}/api/tipos/", headers=headers)
            print(f"✅ Protected Endpoint (Tipos): Status {response.status_code}")
            
        elif response.status_code == 400:
            print(f"⚠️  User Registration: Status {response.status_code} (User might already exist)")
        else:
            print(f"❌ User Registration: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Registration Error: {e}")
    
    # Test 4: Try to login with existing user
    try:
        login_data = {
            "username": "admin",  # Using the admin user we created
            "password": "admin123"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            print(f"✅ Admin Login: Status {response.status_code}")
            data = response.json()
            access_token = data.get('access')
            
            # Test 5: Try to access all endpoints with admin token
            headers = {'Authorization': f'Bearer {access_token}'}
            
            endpoints = [
                "/api/tipos/",
                "/api/escenarios/",
                "/api/equipamientos/",
                "/api/eventos/",
            ]
            
            for endpoint in endpoints:
                try:
                    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                    print(f"✅ {endpoint}: Status {response.status_code}")
                except Exception as e:
                    print(f"❌ {endpoint}: Error {e}")
                    
        else:
            print(f"❌ Admin Login: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Login Error: {e}")
    
    print("=" * 50)
    print("🏁 Testing completed!")

if __name__ == "__main__":
    test_endpoints()
