

    export const plansMap = [
        {   
            id:'basic',
            name:'Basic',
            description: 'Get started with blogAI!',
            price:"10",
            items:["3 Blog Posts","3 Transcription" ],
            paymentLink: "https://buy.stripe.com/test_4gweYUc89fOh0jCcMM",
            priceId:process.env.NODE_ENV === 'development'? "price_1RCsYi2MwwfzXHrFumG2fZxY":""
        },
        {   
            id:'pro',
            name:'Pro',
            description: "All Blog Posts,let's go!",
            price:"19.99",
            items:["unlimited Blog Posts","unlimited Transcriptions" ],
            paymentLink: "https://buy.stripe.com/test_4gw5ok6NP8lP7M4eUV",
            priceId:process.env.NODE_ENV === 'development'?"price_1RCsaS2MwwfzXHrFcUOaJlhh":""
        },
        
    ]