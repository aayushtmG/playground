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
function getUsers(db,callback){
     db.all('SELECT * FROM users',(err,rows)=>{
        if(err){
            return callback(err,null);
        }
        if(rows.length == 0){
            return callback(null,[]);
        }
        const idFilteredRows = rows.map(row => {
            const {id,...restData } = row;
            return restData
        });
        callback(null,idFilteredRows);
    })
}


function createUser(db,data,callback){
    const columns = Object.keys(data);
    const placeholders = columns.map(m => '?').join(', ');
    const values = Object.values(data);
    const sqlQuery = db.prepare(`INSERT INTO users(${columns}) values(${placeholders})`);

    sqlQuery.run(values,function(err){
        if(err){
            return callback(err,null);
        }
        const lastID = this.lastID;
        sqlQuery.finalize();
        

        //returning the new user
        db.get('SELECT * FROM users WHERE id = ?',[lastID],(err,user)=>{
            if(err){return callback(err,null);} 
            if(!user){
                console.warn('couldnt retrieve the user with id' ,lastID);
                return callback('Couldnt find user',null);
            }
            callback(null,user);
        })
    })
}

function getUser(db,data,callback){
    db.get('SELECT * from users WHERE email = ?',[data.email],(err,user)=>{
        if(err){
            console.log(err);
            return;
        }
        if(!user){
            return callback('No user found',null);
        }
        //validating before returning the user
        if(user.password !== data.password){
            return callback('Invalid Credentials',null);
        }
        const {id, ...userData}= user;
        callback(null,userData);
    }) 
}

module.exports ={createTables,createUser,getUsers,getUser}
