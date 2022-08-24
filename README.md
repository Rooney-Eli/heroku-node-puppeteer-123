Setup:\
    Initialize npm project importing express and puppeteer\
    Create Procfile with contents \
    Write the actual JS code \
    ...Don't forget the gitignore...
```
    $heroku login    
    $heroku create "projectName"
    $heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack.git
    
    $git add .
    $git commit -m "init commit"
    $git push heroku master
```    
    