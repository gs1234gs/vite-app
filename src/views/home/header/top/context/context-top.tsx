import { CommentOutlined, GlobalOutlined, SoundOutlined, UserOutlined } from '@ant-design/icons'
import styles from '../styles/home-header-top.module.scss'
import { Button } from 'antd'
import router from '../../../../../routes'

const ContextTop =()=>{
    return(


        <div className={styles.header_div}>
                 <span className={styles.header_span_left}>华为人才在线</span>
            <span className={styles.header_span_right}>

            <SoundOutlined className={styles.header_span_right_icon1} />
            <CommentOutlined className={styles.header_span_right_icon2}  />
                     <GlobalOutlined className={styles.header_span_right_icon3} />
            <span className={styles.header_span_right_span1}>中 EN</span>
  
            <UserOutlined className={styles.header_span_right_icon4} />
           <Button 
           type="link" 
           className={styles.header_span_right_button}
           onClick={() => {
            router.navigate('/sign-in');
           }}
           >
            Link Button
            </Button>
            </span>
         
        </div>

    )
}

export default ContextTop