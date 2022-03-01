//DESAFIO 4 BLACK AND WHITE
const yargs = require('yargs');
const http = require('http');
const url = require('url');
const fs = require('fs');
const Jimp = require('jimp');
//START
// node index.js acceso -p=123
//nodemon index.js acceso -p=123

//USER ACCOUNT
const pass = 123;

//LINEA DE COMANDO
const argv = yargs
	.command(
		'acceso',
		'Comando para levantar el servidor',
		{
			// PASSWORD
			pass: {
				describe: 'Contraseña',
				demand: true,
				alias: 'p',
			},
		},
		(args) => {
			// PASSWORD REQUEST
			if (args.pass == pass) {
				http.createServer((req, res) => {
					console.log('Server on');
					const params = url.parse(req.url, true).query;

					if (req.url == '/') {
						res.writeHead(200, {
							'Content-Type': 'text/html',
						});
						fs.readFile('index.html', 'utf8', (err, html) => {
							res.end(html);
						});
					}
					if (req.url == '/estilos') {
						res.writeHead(200, {
							'Content-Type': 'text/css',
						});
						fs.readFile('main.css', (err, css) => {
							res.end(css);
						});
					}
					//CREAR
					if (req.url.includes('/crear')) {
						const url = params.imagen;
						try {
							Jimp.read(url, (err, imagen) => {
								imagen
									//REDIMENSION
									.resize(350, Jimp.AUTO)
									//ESCALA DE GRISES
									.greyscale()
									//CALIDDAD 60%
									.quality(60)
									.writeAsync('newImg.jpg')
									.then(() => {
										// READ FILE
										fs.readFile('newImg.jpg', (err, Imagen) => {
											res.writeHead(200, {
												'Content-Type': 'image/jpeg',
											});
											res.end(Imagen);
										});
									});
							});
						} catch (err) {
							res.write(`Error al crear archivo! ${err}`);
							console.log(`Error al crear archivo! ${err}`);
							res.end();
						}
					}
				}).listen(8080, () => console.log('Servidor corriendo en puerto 8080'));
			} else {
				console.log('Credenciales incorrectas');
			}
		}
	)
	.help().argv;
