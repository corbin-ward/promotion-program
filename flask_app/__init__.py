############################################# CONSTRUCTOR #############################################
# Applying imports here allows to be accessed throughout the entire project files
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)


CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = "None"  # Only use "None" if the site is secure (HTTPS)
app.config['SESSION_COOKIE_SECURE'] = False  # Only use True if the site is served over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = 'Lax'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

app.secret_key = "shhhhh"  # to use session
jwt = JWTManager(app)

# we are creating an object called bcrypt, 
# which is made by invoking the function Bcrypt with our app as an argument     
from flask_bcrypt import Bcrypt # Importing Bcrypt 
bcrypt = Bcrypt(app)



