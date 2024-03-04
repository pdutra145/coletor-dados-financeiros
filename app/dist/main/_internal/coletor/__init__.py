import gspread
from gspread_dataframe import set_with_dataframe
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import os
import sys

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

# Check if running as a PyInstaller bundle
if getattr(sys, 'frozen', False):
    # If the script is running in a PyInstaller bundle, use the _MEIPASS attribute
    current_dir = sys._MEIPASS
else:
    # If the script is running in a normal Python environment, use __file__
    current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the credentials.json file
credentials_path = os.path.join(current_dir, 'credentials.json')

# Add credentials to the account
creds = ServiceAccountCredentials.from_json_keyfile_name(credentials_path, scope)

# Authorize the clientsheet
client = gspread.authorize(creds)
