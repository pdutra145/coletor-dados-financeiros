from setuptools import setup, find_packages

# Function to read the list of requirements from requirements.txt
def load_requirements(filename='requirements.txt'):
    with open(filename, 'r') as f:
        return f.read().splitlines()
    
setup(name='financial-data-collector-api', packages=find_packages(), include_package_data=True, requires=load_requirements())