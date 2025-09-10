# readme

## FT 

tool.html permette di convertire un file html in: 
- in png 
- pdf raster (imamgine nel pdf, testo NON selzionabile, non ottimale)
- word (non testato)
- pdf vettoriale (pdf con testo selzionabile)

## BE 

convert.js: 
- se avviato con il path del file html inserito da riga di comando, avvia la conversione 
- se avviato senza il path, resta in attesa di una POST sulla porta 3000, contenente il path del file

I file sono convertiti nella stessa cartella d'origine. 