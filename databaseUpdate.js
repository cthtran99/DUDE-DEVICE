const {MongoClient} = require('mongodb');

async function main() {
    const uri = "mongodb+srv://rivTheAir:crayonInThefucking2@cluster0.ckn6k.mongodb.net/DudagonUsers?retryWrites=true&w=majority";
    console.log("hi 1 \n");
    const client = new MongoClient(uri);
    try{
        await client.connect();
        //await listDatabases(client);
        await searchUser(client, "antjohn");
    }
    catch (e){
        console.error(e);
    }
    finally {
        await client.close();
    }
    console.log("hi 2 \n");
}

main();

async function searchUser(client, searchTerm){
    const result = await client.db("DudagonUsers").collection("users").findOne({user : searchTerm});
    if(result){
        console.log(`found: ${searchTerm}\n`)
    }
    else {
        console.log(`not found: ${searchTerm}\n`)
    }
}
