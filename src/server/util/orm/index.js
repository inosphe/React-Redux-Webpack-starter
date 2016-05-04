function orm(connection, collectionName, driverName){
	var driver;

	try{
		driver = getDriver(driverName);

		return new driver(connection, collectionName);
	}
	catch(e){
		logger.error('invalid orm driver name');
		logger.info({collectionName, driverName})

		return null;
	}
}

function getDriver(driver){
	return require('./' + driver);
}

module.exports = orm;
