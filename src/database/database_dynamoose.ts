import * as dynamoose from 'dynamoose';

dynamoose.AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
  });

  const Country = dynamoose.model('Country', {id: Number, name: String});

  let country = new Country({id: 1, name: "USA"});

  country.save();