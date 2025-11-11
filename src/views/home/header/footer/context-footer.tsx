import imageLog from '../../../../assets/huawei01.png'
import styles from './styles/context-footer.module.scss'
// import HomeMenuDown from './hpme-menu-doen'
const ContextFooter =()=>{
    return(
        <div className={styles.container_div}>

        {/* <span style={{color:'black'}}>这是底部sging</span> */}
        <span>
            <img className={styles.logo_img} src={imageLog} alt="logo" />
        </span>
        <span className={styles.span1}>

        {/* <HomeMenuDown/> */}

        </span>

        </div>
    )
}

export default ContextFooter;