# Using Protolabs Offline Maps

### Download and run vector maps
Download latest .pmtiles from https://maps.protomaps.com/builds/  
Copy to protomaps/data folder  
*(TODO - make script that syncs/updates the map package)*

Run pmtiles server inside docker with:  
cd roc\prototype\protomaps  
docker-compose up -d  

Docker file .yml in protomaps folder will set up and run 
*(TODO - use other service than docker for deployment?)*

### Download and run sprite+glyphs and fonts
Clone the assets repository as assets (folder)  
git clone https://github.com/protomaps/basemaps-assets.git assets


### Styling maps
There is currently a style for each palette mode in protomaps/styles
These can be styled using Maputnik (editor.protomaps.com)
Before editing/uploading to Maputnik, the style sources and sprite+glyphs in JSON need to be edited to online pmtiles.
Use maputnik.json as template reference. If error, check syntax in JSON.

        "protomaps": {
            "type": "vector",
            "attribution": "<a href=\"https://github.com/protomaps/basemaps\">Protomaps</a> © <a href=\"https://openstreetmap.org\">OpenStreetMap</a>",
            "url": "pmtiles://https://demo-bucket.protomaps.com/v4.pmtiles"
        }

    ],
    "sprite": "https://protomaps.github.io/basemaps-assets/sprites/v4/black",
    "glyphs": "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf"
}

After styled in Maputnik download (Save As) and change back to "tiles": ["http://localhost:8080/planet/{z}/{x}/{y}.mvt"],