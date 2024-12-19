import backgroundImage from '.././images/petition.jpg';

const Home = () => {


    return (
        <div style={{backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        width: '100vw',
        height: '90vh',
        marginTop: "12vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'}}>
        </div>
    )
}

export default Home;