

    export const plansMap = [
        {   
            id:'basic',
            name:'Basic',
            description: 'Get started with blogAI!',
            price:"10",
            items:["3 Blog Posts","3 Transcription" ],
            paymentLink: "https://buy.stripe.com/cN2g1haz42Ix568144",
            priceId:process.env.NODE_ENV === 'development'? "price_1RCsYi2MwwfzXHrFumG2fZxY":"price_1RCspx2MwwfzXHrFXnJeen7A"
        },
        {   
            id:'pro',
            name:'Pro',
            description: "All Blog Posts,let's go!",
            price:"19.99",
            items:["unlimited Blog Posts","unlimited Transcriptions" ],
            paymentLink: "https://buy.stripe.com/28o16n7mSbf3aqs8wx",
            priceId:process.env.NODE_ENV === 'development'?"price_1RCsaS2MwwfzXHrFcUOaJlhh":"price_1RCspx2MwwfzXHrFLX9WKswJ"
        },
        
            
    ]
    export const ORIGIN_URL = 
            process.env.NODE_ENV === 'development'
            ?"localhost:3000"
            :"https://blogai.blog"