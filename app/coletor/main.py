import pandas as pd
import datetime as dt
import requests
from gspread_dataframe import get_as_dataframe, set_with_dataframe
from gspread_formatting.dataframe import format_with_dataframe
from typing import Literal
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .utils import URL_BASE_IPCA, PLANILHA, get_expectativa_anual, br_date_parser, ipca_date_parser
from bcb import sgs
import DadosAbertosBrasil as dab
from . import client


app = FastAPI()

origins = [
    '*',
    "http://localhost:9000/",  # Adjust this to the client's URL
]
print(origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that are allowed to make requests
    allow_credentials=True,  # Whether to support credentials (cookies, Authorization headers)
    allow_methods=["*"],  # Which methods to allow, ["GET", "POST"] or ["*"] for all
    allow_headers=["*"],  # Which headers are allowed, can be a list or ["*"] for all
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get(path='/selic-over')
async def selic_over(initial_date:str = dt.date.today().isoformat()):
    spreadsheet = client.open(PLANILHA)
    try:
        worksheet = spreadsheet.worksheet('Selic')
    except:
        worksheet = spreadsheet.add_worksheet('Selic', 1, 3)
        
    df = get_as_dataframe(worksheet, index_col=[0],usecols=[0,1,2], header=0)

    selic_over_dados = dab.selic(periodo='diario', inicio=initial_date, fim=dt.date.today().isoformat(), index=True)
    if selic_over_dados.empty:
        return JSONResponse(content=dict(message='Nenhuma taxa encontrada'), status_code=status.HTTP_204_NO_CONTENT)

    # selic_over_dados.index = pd.to_datetime(selic_over_dados.index)
    for date, vals in selic_over_dados.iterrows():
        # formatted_date = pd.to_datetime(date).strftime('%d/%m/%Y')  # Convert to 'DD/MM/YYYY' string
        df.loc[date, 'Selic Over'] = vals['valor']

    # df.index = [date_df.strftime('%d/%m/%Y') for date_df in df.index]
    set_with_dataframe(worksheet, df, include_index=True)
    format_with_dataframe(worksheet, df)

    return JSONResponse(content={'message':'Selic Over coletada com sucesso!'}, status_code=status.HTTP_200_OK)


@app.get('/relatorio-focus')
async def focus(indicador:Literal['Selic', 'IPCA']= 'Selic', date:str = dt.date.today().isoformat()):
    spreadsheet = client.open(PLANILHA)
    try:
        worksheet = spreadsheet.worksheet('Relatório Focus')
    except:
        worksheet = spreadsheet.add_worksheet('Relatório Focus', 1, 3)

    df = get_as_dataframe(worksheet, parse_dates=True, index_col=[0],usecols=list(range(11)), header=0)
    expectativas_dados = get_expectativa_anual(indicador, date)
    if expectativas_dados.empty:
        print('here')
        return JSONResponse(content=dict(message=f'Expectativas para {indicador} não disponível'), status_code=status.HTTP_202_ACCEPTED)
    
    expectativas_dados.set_index('Data', inplace=True)

    for date, vals in expectativas_dados.iterrows():
        df.loc[dt.datetime.strptime(date,'%Y-%m-%d').strftime('%Y-%m-%d'), f'{indicador.capitalize()} {vals["DataReferencia"]}'] = vals['Mediana']

    set_with_dataframe(worksheet, df, include_index=True)
    # format_with_dataframe(worksheet, df)
    return JSONResponse(content=dict(message='Expectativa coletada'), status_code=status.HTTP_200_OK)

@app.get('/ipca')
def ipca(date:dt.date):
    spreadsheet = client.open(PLANILHA)
    try:
        worksheet = spreadsheet.worksheet('Ipca')
    except:
        worksheet = spreadsheet.add_worksheet('Ipca', 1, 3)

    df = get_as_dataframe(worksheet, parse_dates=True, index_col=[0],usecols=[0,1], header=0)
    
    URL = URL_BASE_IPCA.format(ANO_MES=date.strftime('%Y%m'))
    data = requests.get(URL)
    ipca_info = data.json()
    
    if len(ipca_info) == 0:
        return JSONResponse(content=dict(message='Nenhum dado de IPCA para esse período'), status_code=status.HTTP_202_ACCEPTED)
    
    for i in range(len(ipca_info)):
        resultado = ipca_info[i]["resultados"][i]['series'][i]['serie']
        df.loc[date.isoformat(), 'Var. Mensal Ipca'] = list(resultado.values())[0]
        print(resultado)

    set_with_dataframe(worksheet, df, include_index=True)

    return JSONResponse(content=dict(message='Ipca mensal coletado!'), status_code=status.HTTP_200_OK)
