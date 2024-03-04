import pandas as pd
import datetime as dt
import bcb
import requests

PLANILHA = "Coleta de Índices Econômicos"
PLANILHA_ATUALIZADA = (
    "2024.01.22 COLETA AUTOMÁTICA DOS INDICES ECONOMICOS SELIC E IPCA_atualizado.xlsx"
)
URL_BASE_IPCA = "https://servicodados.ibge.gov.br/api/v3/agregados/118/periodos/{ANO_MES}/variaveis/306?localidades=N1[all]"

def br_date_parser(date:str):
    return pd.to_datetime(date, format='%d/%m/%Y', dayfirst=True)

def ipca_date_parser(date:str):
    return pd.to_datetime(date, format='%m/%Y')

def read_sheet():
    with pd.ExcelFile(PLANILHA) as xls:
        df = pd.read_excel(xls, sheet_name=None)
    return df

def get_ipca(date:str):
    URL = URL_BASE_IPCA.format(ANO_MES=date)
    data = requests.get(URL)
    ipca_info = data.json()
    for i in range(len(ipca_info)):
        resultado = ipca_info[i]["resultados"][i]['series'][i]['serie']
        print(resultado)

def update_sheet(main_sheet:pd.DataFrame,target_sheet:str, index_label:str):
    with pd.ExcelWriter(PLANILHA, engine='xlsxwriter') as writer:
            for sheet_name, df in main_sheet.items():
                if sheet_name == target_sheet:
                    df.index = df.index.sort_values(ascending=True)
                    
                    df.to_excel(writer, sheet_name=sheet_name, index_label=index_label)
                else:
                    df.to_excel(writer, sheet_name=sheet_name, index=False)


def get_dates_to_fetch(df: pd.DataFrame, target_col: str):
    today = dt.date.today()

    dates_to_fetch = [today]

    for date in df.index:
        if date < today and pd.isna(df.loc[date, target_col]):
            dates_to_fetch.append(date)

    min_date = min(dates_to_fetch)
    max_date = max(dates_to_fetch)

    return min_date, max_date


def add_data_to_df(df: pd.DataFrame, col_to_append: str, data: pd.DataFrame):
    new_df = df.copy()
    for date, val in data.iterrows():
        value = float(val["valor"])

        # date_str, value = val.values()
        # date = dt.datetime.strptime(date_str, '%d/%m/%Y').date()
        # value = float(value)
        new_date = date.date()
        new_df.loc[new_date, col_to_append] = value

    return new_df


def get_expectativa_anual(indicador: str, initial_date:str):
    expectativas = bcb.Expectativas()
    ep = expectativas.get_endpoint("ExpectativasMercadoAnuais")

    print(initial_date)

    dados = (
        ep.query()
        .filter(f"Indicador eq '{indicador}' and Data ge '{initial_date}'")
        .orderby("Data desc")
        .format("json")
        # .limit(5)
        .select(ep.DataReferencia, ep.Data, ep.Mediana)
        .collect()
    )

    # dados['Data'] = pd.to_datetime(dados['Data'])
    # dados.set_index('Data', inplace=True)

    return dados

get_ipca(dt.date(year=2003, month=6, day=12).strftime('%Y%m'))