function orm(app, connection, collectionName, driverName){
	var driver;

	try{
		driver = getDriver(driverName);

		return new driver(app, connection, collectionName);
	}
	catch(e){
		logger.error('invalid orm driver');
		logger.info({collectionName, driverName})
		logger.info(e);

		return null;
	}
}

function getDriver(driver){
	return require('./' + driver);
}

module.exports = orm;
