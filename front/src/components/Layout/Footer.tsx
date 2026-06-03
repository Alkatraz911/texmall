import React, { useEffect, useState } from "react";
import { contactAPI } from "../../services/api";
import "./Footer.css";
import logo from '../../assets/logo.png';
import { Smartphone, Mail, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import mechta from '../../assets/logos/mechta-removebg-preview.png'
import buona from '../../assets/logos/buonanobg.png'
import softstyle from '../../assets/logos/softstyle.png'
import ultrasofa from '../../assets/logos/ultrasofa.png'
import barhat from '../../assets/logos/barhat.png'
interface FooterData {
  companyName: string;
  description: string;
  phone1: string;
  email1: string;
  address1: string;
  city1: string;
  phone2: string;
  email2: string;
  address2: string;
  city2: string;
}

const partners = [
  {
    link: 'https://mechta-mebel73.ru/?ysclid=mmaaun7lt12497850',
    image: mechta,
    name: 'Мебельная фабрика "Мечта"'
  },
  {
    link: 'https://buona-mebel.ru/',
    image: buona,
    name: 'Буона Мебель'
  },
  {
    link: '',
    image: softstyle,
    name: 'Производство мебели "Мягкий стиль"'
  },
  {
    link: 'https://vk.com/ultra_sofa73',
    image: ultrasofa,
    name: 'Мебельная фабрика "Ультра Софа"'
  },
  {
    link: 'https://www.instagram.com/barhat73mebel?igsh=ZGEyNWppazNlaHJn&utm_source=qr',
    image: barhat,
    name: 'Фабрика мягкой мебели "Бархат"'
  }
]

const Footer: React.FC = () => {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const page = await contactAPI.getPage();
        setData({
          companyName: "TEKС МОЛЛ",
          description: "Качественные ткани для создания уникальных изделий.",
          phone1: page.phone1,
          email1: page.email1,
          address1: page.address1,
          city1: page.city1,
          phone2: page.phone2,
          email2: page.email2,
          address2: page.address2,
          city2: page.city2
        });
      } catch (error) {
        console.error("Ошибка загрузки футера:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) return <footer className="footer">Загрузка футера...</footer>;
  if (!data) return <footer className="footer">Данные футера недоступны</footer>;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src={logo} alt="логотип" />
            <p id="underlogodescription">{data.description}</p>
          </div>

          {/* <div className="footer-section">
            <h4>Навигация</h4>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/about">О фирме</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </div> */}
          <div className="footer-section">
            <h4>{data.city1}</h4>
            <div className="footer-paragraph">
              <strong className="phoneIcon"><Smartphone /></strong><p style={{ whiteSpace: "pre-line" }}>{data.phone1.split(",").join("\n")}</p>
            </div>
            <div className="footer-paragraph">
              <strong><Mail /></strong> <p>{data.email1}</p>
            </div>
            <div className="footer-paragraph">
              <strong><MapPin /></strong>
              <p> {data.address1}</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>{data.city2}</h4>
            <div className="contacts">
              <div className="footer-paragraph">
                <strong className="phoneIcon"><Smartphone /></strong><p style={{ whiteSpace: "pre-line" }}>{data.phone2.split(",").join("\n")}</p>
              </div>
              <div className="footer-paragraph">
                <strong><Mail /></strong> <p>{data.email2}</p>
              </div>
              <div className="footer-paragraph">
                <strong><MapPin /></strong>
                <p> {data.address2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          {/* <p>&copy; {new Date().getFullYear()} {data.companyName}. Все права защищены.</p> */}
          <h4>Наши партнеры</h4>
          <Swiper
            // install Swiper modules
            modules={[Navigation, Autoplay]}
            // spaceBetween={"auto"}
            slidesPerView={2}
            navigation={false}
            loop={true}
            autoplay={{
              delay: 3000,       // время между прокрутками (мс)
              disableOnInteraction: true, // продолжает автопрокрутку после взаимодействия
            }}
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 2,
                spaceBetween: 5
              },
              // when window width is >= 480px
              640: {
                slidesPerView: 4,
                spaceBetween: 5
              },
              // when window width is >= 640px
              1280: {
                slidesPerView: 4,
                spaceBetween: 10
              },
              2000: {
                slidesPerView: 4,
                spaceBetween: 10
              }
            }}

          // slidesOffsetAfter={20}
          // slidesOffsetBefore={20}
          >
            {partners.map((category, i) => (
              <SwiperSlide key={i}>
                <div className="partner-card">
                  {category.link ? (
                    <a
                      href={category.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={category.image} alt="partner logo" />
                    </a>
                  ) : (
                    
                      <img src={category.image} alt="partner logo" />
                    
                  )}
                  <span>{category.name}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
