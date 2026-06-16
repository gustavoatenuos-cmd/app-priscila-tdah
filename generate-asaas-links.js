const https = require('https');

const API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc4Y2YyYzM2LTVjN2UtNDRmOC1iYTViLWU1ZmJhMGRiYTQyYTo6JGFhY2hfOWFhMmNmZDMtNGFkZS00MjMyLWIxMzEtZGVhYTYzYmU4NzY2';

const plans = [
  { key: 'ASAAS_LINK_CONSTANTE_MONTHLY', name: 'TDAH Constante - Plano Constante Mensal', value: 49.90, cycle: 'MONTHLY' },
  { key: 'ASAAS_LINK_CONSTANTE_YEARLY', name: 'TDAH Constante - Plano Constante Anual', value: 499.00, cycle: 'YEARLY' },
  { key: 'ASAAS_LINK_PLENO_MONTHLY', name: 'TDAH Constante - Plano Pleno Mensal', value: 97.90, cycle: 'MONTHLY' },
  { key: 'ASAAS_LINK_PLENO_YEARLY', name: 'TDAH Constante - Plano Pleno Anual', value: 970.00, cycle: 'YEARLY' }
];

async function createPaymentLink(plan) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: plan.name,
      description: "Assinatura TDAH Constante",
      value: plan.value,
      billingType: "UNDEFINED",
      chargeType: "RECURRENT",
      dueDateLimitDays: 3,
      subscriptionCycle: plan.cycle
    });

    const options = {
      hostname: 'api.asaas.com',
      port: 443,
      path: '/v3/paymentLinks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY,
        'User-Agent': 'TDAH Constante App',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Gerando links...");
  for (const plan of plans) {
    try {
      const result = await createPaymentLink(plan);
      console.log(`\n${plan.key}=${result.url}`);
    } catch (e) {
      console.error(`Erro ao criar ${plan.name}: ${e.message}`);
    }
  }
}

run();
