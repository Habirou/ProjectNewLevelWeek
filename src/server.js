const express = require("express")
const server = express() //servira a manipuler le server

// connexion a la base de donner
const db = require("./database/db")


server.use(express.static("public"))


server.use(express.urlencoded({ extended: true }))


const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})



server.post("/savepoint", (req, res) => {


    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
             
            console.log(err)
            return res.send("Erro! no cadastrado")

        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })

    }

    db.run(query, values, afterInsertData) //pour inserer
})



server.get("/search", (req, res) => {

    // Pour la bare de recherche
    const search = req.query.search
    // Lorsque la recherche ne trouve rien
    if (search == "") {
        return res.render("search-results.html", { total: 0 })
    }





    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        
        // Lorsque la trouve le vrai resultat ou autre chose samblant
        if (err) {
            return console.log(err)
        }

        const total = rows.length
        //envoie des données dans le html
        return res.render("search-results.html", { places: rows, total: total })
    })

})


server.listen(3000)

