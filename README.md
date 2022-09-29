# Parcial 1 - M2 Tokenization

## Setup

1. Clonar el repositorio

2. Complete sus datos:
  * NUMERO DE ESTUDIANTE:
  * NOMBRE DE ESTUDIANTE:
  * ADDRESS DE SU CUENTA:
  * ADDRESS DEL CONTRATO:

3. Complete las siguientes variables en el archivo .env:
  * STUDENT_NUMBER = 
  * STUDENT_ADDRESS = 

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
