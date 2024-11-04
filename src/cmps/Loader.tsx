import loaderGif from '../assets/img/loading.gif'

interface props {
    isBG?: boolean
}
export function Loader({ isBG = false }: props) {

    return (
        <section className="loader">
            {isBG &&
                <main className='loader-BG'></main>
            }

            <img className='loader-gif' src={loaderGif} alt="" />
        </section>
    )

}