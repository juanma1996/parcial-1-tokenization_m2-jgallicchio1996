[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=8715923&assignment_repo_type=AssignmentRepo)
# Parcial 1 - M2 Tokenization

## Setup

1. Clonar el repositorio

2. Complete sus datos:
  * NUMERO DE ESTUDIANTE: 233335
  * NOMBRE DE ESTUDIANTE: Juan Manuel Gallicchio Antelo
  * ADDRESS DE SU CUENTA: 0x8fB32163b178984e8f1b204f5527DE8A9D1bEBB8
  * ADDRESS DEL CONTRATO: Contract ERC721 Address: 0x05587A493eD8cb29CFA54E521Cc7d231c2276812 -- Contract ERC720 Address: 0x94B30c21E90c49d539c024A5d6bf8d06e392BE78

3. Complete las siguientes variables en el archivo .env:
  * STUDENT_NUMBER = 233335
  * STUDENT_ADDRESS = 0x8fB32163b178984e8f1b204f5527DE8A9D1bEBB8

4. Installar hardhat `npm install hardhat --save-dev`

5. Instalar dependencias `npm install`

6. Complete la información del archivo `.env` en el directorio raiz de la carpeta. Si no utilizará Ganache para sus pruebas quitelo de la configuración.

7. Configure el archivo `hardhat.config.js` según sus necesidades

## Business ecosystem

Se desea generar dos contratos inteligentes para la tokenización de metros cuadrados, donde se utilizará el estandar ERC-20 de tokens fungibles para representar cada metro cuadrado 1x1 emitiendo tokens M2 y el estandar ERC-721 para representar como NFT a un conjunto de metros cuadrados superior a 1x1, a lo que se le denominará floor.

Los NFT floor para ser adquiridos deberán ser pagados con ethers a un precio establecido al momento de la construcción del protocolo, el cual incrementara o disminuirá con las operaciones del contrato.

En tanto para obtener tokens ERC-20 M2 se deberá quemar un NFT floor que se dividirá en la cantidad equivalente de metros cuadrados. Esta operación también tendrá costo.
Los tokens M2 también podrán ensamblarse para generar tokens floor ERC-721.

## Task

1. Se debe implementar los métodos descriptos en los contratos `NFT_Floor.sol` y `ERC20-M2.sol` ubicados en la carpeta `contracts`. La implementación de cada método deberá cumplir con la descripción asociada, respetando los requerimientos. Se puede hacer uso de funciones auxiliares pero **deben** ser de visibilidad `private` y/o, en caso de que lo considere, hacer uso de `modifier`.

2. Pruebe las funcionalidades de sus contratos con el script de test proporcionado. ejecute: `npx hardhat test`. Puede agregar casos de prueba en cada que lo entienda necesario. 

3. Publique su contrato a la red de pruebas de Ethereum de nombre Rinkeby ejecutando el script `deploy.js` con el comando:

`npx hardhat run scripts/deploy.js --network rinkeby`.

NOTA: Utilice para todos sus comentarios la nomenclatura definida por ´Ethereum Natural Language Specification Format´ (´natspec´). Referencia: https://docs.soliditylang.org/en/v0.8.16/natspec-format.html


## **IMPORTANTE** Suba sus cambios al repositorio

1. Publicar cambios a su repositorio

`git add .`  
`git commit -m "<<your comments here>>"`  
`git push origin main`

------------------------------------------------------------------------------------------------------------------

#### **IMPORTANTE**
 * No altere ni modifique las carpetas y/o el contenido de la carpeta '.github/workflows'
 * No cambie ninguna configuración del repositorio
 * El trabajo es individual y copiar, cometer plagio o recibir ayuda no autorizada de terceros en la realización de trabajos académicos es considerado una falta grave según el Art. 51 del Reglamento Estudiantil (http://www.ort.edu.uy/varios/pdf/documento001.pdf).
