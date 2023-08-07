# CampTrek

CampTrek is a seamless web application that offers users an easy online booking experience to reserve campsites with just a few clicks. It enables users to provide reviews and ratings for campsites, helping others plan their treks more effectively. The app also provides campground owners with effortless management of their campsite listings and associated details. With CRUD functionality integrated, users can efficiently interact with data. The application utilizes Cloudinary storage for smooth image uploads and Mapbox for integrating maps to locate campgrounds. Additionally, the Passport node module is employed to implement authentication and authorization functionalities.

## Features

- **Easy Booking**: Book your favorite campsites quickly and effortlessly through an intuitive interface.
- **Reviews and Ratings**: Share your experiences by providing reviews and ratings for campsites, helping fellow trekkers make informed decisions.
- **Campground Owner Dashboard**: Campground owners can manage their campsite listings and update associated details with ease.
- **CRUD Functionality**: Users can efficiently create, read, update, and delete campground data, providing a seamless data interaction experience.
- **Cloudinary Image Upload**: Easily upload and manage images of campsites using Cloudinary's image storage solution.
- **Map Integration**: Mapbox integration allows users to locate and explore campgrounds on an interactive map.

## Technologies Used

- **Cloudinary**: The application utilizes Cloudinary storage for managing image uploads and storage.

- **Mapbox**: Mapbox is integrated to provide users with interactive maps to locate and explore campgrounds.

- **Passport**: The Passport node module is used to implement authentication and authorization functionalities, ensuring secure access to specific features.

## Installation

Follow these steps to set up the CampTrek web app locally:

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/your-username/camptrek-web-app.git
   cd camptrek-web-app

2. Install the required dependencies:
    ```bash
    npm install

3. Set up environment variables:
    Create a .env file in the root directory and add the following:
    ```bash
    PORT=3000
    DATABASE_URL=your_database_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
    SECRET_KEY=your_secret_key_for_jwt

4. Run the app:
    ```bash
    npm start

5. Open your web browser and navigate to http://localhost:3000 to access CampTrek.


## Usage

1. **User Registration/Login**: Users need to create an account or log in using their credentials to access the full functionality of CampTrek.

2. **Explore Campgrounds**: Browse through the list of campgrounds available on the platform, and use the integrated map to explore their locations.

3. **Booking**: Select a campground and book it with a few clicks. You will receive a confirmation email with booking details.

4. **Reviews and Ratings**: After visiting a campground, users can provide reviews and ratings to help others plan their treks.

5. **Campground Owner Dashboard**: Campground owners can log in to their dashboard to manage their campground listings, update details, and view booking information.

6. **CRUD Operations**: As a user, you can create, read, update, and delete campground data, making it easy to manage your bookings.





Happy Camping! 🏕️

