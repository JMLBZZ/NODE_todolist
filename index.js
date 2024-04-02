const express = require("express");
const session = require("express-session");
const app = express();
const port = 8000;//port sur lequel on écoute

/*
const tasks = [//modèle du tableau où on sauvegardera toutes les tâches
    {
        title:"Lire un chapitre",
        done:false,
    },
    {
        title:"Terminer un jeu",
        done:true,
    },
];
*/

//traitement du formulaire : 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(session({// documentation : https://www.npmjs.com/package/express-session
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }//utiliser cette ligne uniquement connexion sécurisé https
}));

app.set("view engine", "ejs");//on dit à express qu'on utilise le moteur de template ejs

app.get("/", (req, res) =>{
    if (!req.session.tasks){//si le tableau n'existe pas, alors...
        req.session.tasks = [];//... crée le tableau vide où il y aura toutes les tâches
    }

    res.render("todolist",{tasks : req.session.tasks});//rendu de l'uri "/" sur la vue "todolist.ejs" et faire le lien avec le modèle "tasks"
});

app.post("/task", (req,res)=>{
    /*
    req.body.task//corps de la requête et "task" vient du name de l'input du formulaire
    console.log(req.body);
    */
    if (req.body.task){//si la tâche est rempli (non vide) alors :
        req.session.tasks.push({//push ajoute un nouvel élément au tableau / création d'un objet avec la même structure que tasks
            title:req.body.task,
            done:false,//valeur par défaut
        })
    }
    res.redirect("/");//redirection vers app.get
});

app.get("/task/:id/done", (req,res)=>{
    if (req.session.tasks[req.params.id]){//si index existe, alors:
        req.session.tasks[req.params.id].done=true;
    }
    res.redirect("/");//redirection vers app.get
});

app.get("/task/:id/delete", (req,res)=>{
    if (req.session.tasks[req.params.id]){//si index existe, alors:
        req.session.tasks.splice(req.params.id, 1);//fonction js splice --> 1er paramètre est l'indice du tableau, le 2eme c'est le nombre d'élément à supprimer
    }
    res.redirect("/");//redirection vers app.get
});

app.listen(port, () =>{//écoute pour le lancement du serveur sur le port défini
    console.log(`Serveur lancé sur le port ${port}`);
})