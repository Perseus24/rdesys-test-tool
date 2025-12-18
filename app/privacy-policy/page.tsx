'use client';
export default function PrivacyPolicy() {
    return (
        <div className="my-24 flex flex-col  items-start justify-center max-w-4xl w-screen mx-auto font-mono gap-8 text-sm">
            <p className="text-base font-bold">Privacy Policy</p>
                <div className="flex flex-col gap-3">
                    <p className='font-medium'>Overview</p>
                    <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                        <li className='ml-8'>Introduction</li>
                        <li className='ml-8'>Information we collect</li>
                        <li className='ml-8'>Why we process your data</li>
                        <li className='ml-8'>How we use your data</li>
                        <li className='ml-8'>How we share your information</li>
                        <li className='ml-8'>Your choice and obligation</li>
                        <li className='ml-8'>Your rights</li>
                        <li className='ml-8'>Contact Information</li>
                    </ol>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>Introduction</p>
                    <p>Welcome to the RDESys Alpha Testing Platform! As part of our commitment to creating a secure and trustworthy system, we prioritize the privacy and protection of any information shared by our testers.</p>
                    <p>Data privacy refers to the responsible handling, processing, and protection of personal and sensitive information collected through digital systems. It involves collecting only the information that is truly necessary, 
                        using data only for defined and transparent purposes, securing it from unauthorized access, and respecting the rights of individuals whose data is processed. </p>
                    <p>During this alpha testing phase, the information you provide such as feedback, ratings, and remarks is collected solely to evaluate and improve the system’s 
                        functionality and user experience. We adopt a privacy-by-design approach, which means privacy considerations are integrated into the testing platform’s design from the outset, ensuring that your data remains protected throughout the testing process. </p>
                    <p>We believe that safeguarding your data builds trust and strengthens the integrity of the RDESys project. As this is an early testing environment, we maintain transparency regarding how your data is handled and apply appropriate measures to secure it.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>Information we collect</p>
                    <ol>
                        <li className='ml-8'>Contact information</li>
                        <li className='ml-8'>Organization/affiliation</li>
                        <li className='ml-8'>Any additional information relevant to your attendance</li>
                    </ol>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>Why we process your data</p>
                    <ol>
                        <li className='ml-8'>We process the data collected during the alpha testing phase to evaluate system performance, 
                            identify issues, and improve features and user experience. All information gathered is used solely for testing, analysis, and system enhancement purposes.</li>
                    </ol>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>How we use your data</p>
                    <p>The data you provide is used to analyze system functionality, improve features, address issues, and enhance overall user experience during the alpha testing phase. All data is handled securely and used only for system evaluation and development purposes.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>How we share information</p>
                    <p>Information collected during the alpha testing phase is accessed only by the authorized development and research team for system evaluation and improvement. We do not sell, trade, or share your data with third parties, except when required by law or for system maintenance under strict confidentiality.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>Your choice and obligation</p>
                    <p>You may choose whether or not to provide information during the alpha testing phase. By participating, you agree to provide accurate and appropriate data and to use the system responsibly. You also have the right to inquire about, update, or request the removal of your submitted information, subject to applicable policies and system limitations.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>You have the right to:</p>
                    <ol>
                        <li className='ml-8'>Access your personal data.</li>
                        <li className='ml-8'>Request correction of inaccurate data.</li>
                        <li className='ml-8'>Request deletion of your personal data.</li>
                        <li className='ml-8'>Withdraw your consent at any time, where applicable.</li>
                    </ol>
                </div>
                <div className="flex flex-col gap-3">
                    <p className='font-bold'>Contact Information</p>
                    <p>For any concerns regarding this privacy policy or to exercise your data management options, you may contact us at:</p>
                    <div className="flex flex-col gap-2 ml-8">
                        <p className='font-medium'>Email: <span className="font-bold">buovprde@bicol-u.edu.ph</span></p>
                        <p className='font-medium'>Facebook: <a target="_blank" href="https://www.facebook.com/BURDE1977" className="font-semibold text-cyan-600">Bicol University Research Development and Extension</a></p>
                    </div>
                </div>
        </div>
    )
}
