require('dotenv').config()

const Discord = require('discord.js');
const sqlite = require("aa-sqlite");

const client = new Discord.Client();

const prefix = "--";
const DBSOURCE = "./clan.db";
const MIN_ROLE_CREATE_CLAN = "696280134671663105"; //A CHANGER

async function hasClan(user){
	let sql = "SELECT * FROM user WHERE user.id == ?";

	console.log(await sqlite.open(DBSOURCE));
	const row = await sqlite.get(sql, [user]);
	await sqlite.close();

	if (row.clan === null) return false;
	else return true; 
}

async function isClanNameExist(name){
	let sql = "SELECT * FROM clan WHERE name = ?";
	console.log(await sqlite.open(DBSOURCE));
	const row = await sqlite.get(sql, [name]);
	await sqlite.close();
	if(row) return true;
	else return false;
}

async function insertClan(user, name){
	let clan_insert = "INSERT INTO clan(name, score) VALUES (?, 0)";
	let clan_get_id = "SELECT id FROM clan WHERE name = ?";
	let user_insert = "UPDATE user SET clan = ? WHERE id = ?";
	let res_clan = null;
	let res_user = null;

	console.log(await sqlite.open(DBSOURCE));
	res_clan = await sqlite.push(clan_insert, [name]);
	await sqlite.close();

	if(res_clan){
		console.log(await sqlite.open(DBSOURCE));
		const id = await sqlite.get(clan_get_id, [name]);
		await sqlite.close();

		if(id){
			console.log(await sqlite.open(DBSOURCE));
			res_user = await sqlite.push(user_insert, [id, user]);
			await sqlite.close();
		}
	}

	if(res_clan && res_user) return true;
	else return false;
}

async function hasSufficientRole(member, role){
	const highest = member.roles.highest;

	if(highest.comparePositionTo(role) >= 0) return true;
	return false;
}

async function createClan(message, args){

	let user = message.author.id;
	let member = message.guild.member(message.author);
	let min_role = await message.guild.roles.fetch(MIN_ROLE_CREATE_CLAN);
	let channel = message.channel;

	const userHasClan = await hasClan(user);
	const userHasSufficientRole = await hasSufficientRole(member, min_role);
	const same_name = await isClanNameExist(args);

	if(userHasClan) message.channel.send("Vous possédez déjà un clan !");
	else if(!userHasSufficientRole) message.channel.send("Vous êtes encore trop jeune pour créér un clan!");
	else if(same_name) message.channel.send("Ce nom de clan existe déjà :/ Essayez en un autre !")
	else{
		const success = await insertClan(user, args);		
		if(success) message.channel.send("Le clan **__" + args + "__** viens d'être créé !");
		else message.channel.send("Une erreur s'est produite pendant l'ajout du clan :/");
	}
}

async function mainApp() { 

	client.on('message', async function execute(message) {
	  	if (message.content.startsWith(prefix)) {
			let commande = message.content.substring(prefix.length);
			
			if (commande.startsWith("createClan")){
				await createClan(message, commande.substring(11));
			}
			else if (commande.startsWith("addMember")){
				message.channel.send("inviteClan yes");
			}
			else{
				message.channel.send("`" + commande + "` n'est pas une commande connue. Tapez `--help` pour la liste complète des commandes.");
			}

	  	}
	});

	client.login(process.env.DISCORD_TOKEN);
}

mainApp();