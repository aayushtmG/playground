function createTables(db){
    db.run(`
        CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        phone TEXT
)
`)
    console.log('created tables');
db.close();
}
function getUsers(db){
     db.all('SELECT * FROM users',(err,rows)=>{
        if(err){
            console.log(err);
        }
        if(rows.length == 0){
            console.log('no data');
            return;
        }
        rows.forEach(row =>{
            console.log(row);
        })
    })

}


function createUser(db,data){
    const columns = Object.keys(data);
    const placeholders = columns.map(m => '?').join(', ');
    const values = Object.values(data);
    const sqlQuery = db.prepare(`INSERT INTO users(${columns}) values(${placeholders})`);

    sqlQuery.run(values,function(err){
        if(err){
            console.log(err);
            return;
        }
    console.log('user created successfully');
        console.log(`Id: ${this.lastID}`);
        sqlQuery.finalize();
    
    })
    
    // db.run(sqlQuery,values,(err)=>{
    // if(err){
    // console.log(err.message);
    //         return
    //     }
    //     console.log(this);
    // console.log(`id: ${this.lastID} added`);
    // });
    // const info = sqlQuery.run(...values);
    // sqlQuery.finalize();
    //
    // console.log(info,info.lastID);
}


module.exports ={createTables,createUser,getUsers}
