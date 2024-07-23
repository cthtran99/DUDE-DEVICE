const {MongoClient} = require('mongodb');

async function main() {
    const uri = "mongodb+srv://rivTheAir:crayonInThefucking2@cluster0.ckn6k.mongodb.net/DudagonUsers?retryWrites=true&w=majority"
    const client = new MongoClient(uri);
    try{
        await client.connect();
        //await listDatabases(client);
        await createEntry(client, {
            user: "zimmy",
            password: "themistymountain"
        })
    }
    catch (e){
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main().catch(console.error);

async function createEntry(client, newEntry){
    const result = await client.db("DudagonUsers").collection("users").insertOne(newEntry);
    console.log(`new entry: ${result.insertedId}`);
}

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// }