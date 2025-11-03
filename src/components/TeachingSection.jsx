import {ways} from "../data.js"
import WayToTeach from "./WayToTeach.jsx"

export default function TeachingSection() {
    return (
        <section>
                <h3>Наш подход к обучению ахуенный</h3>
        
                <ul>
                  {ways.map((way) => 
                    (<WayToTeach key={way.title} {...way}></WayToTeach>))}
                  {//<WayToTeach {...ways[0]}/>
                   //<WayToTeach title={ways[2].title} description={ways[2].description}/>
                  }
                  
                </ul>
        </section>
    )
}