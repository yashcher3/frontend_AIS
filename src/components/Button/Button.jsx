import classes from './Button.module.css'

export default
 function Button({children, isActive, ...props}) {

    return(
    <button 
        {...props}
        
        className={
            isActive ? `${classes.button} ${classes.isActive}` : classes.button}
             >
        {children}
        </button>)

    // return(
    // <button className={isActive ? "button active" : "button"} onClick={onClick} >
    //     {children}
    //     </button>)
}