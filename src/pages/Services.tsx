import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const services = [
  { 
    icon: 'Scissors', 
    title: 'Стрижки', 
    description: 'Женские, мужские и детские стрижки от профессиональных мастеров',
    details: 'Наши стилисты создадут идеальную стрижку, учитывая особенности вашего лица, структуру волос и последние тренды. Мы работаем только с профессиональными инструментами и косметикой премиум-класса.'
  },
  { 
    icon: 'Sparkles', 
    title: 'Окрашивание', 
    description: 'Все виды окрашивания: тонирование, мелирование, омбре',
    details: 'Используем безаммиачные красители щадящего действия. Специализируемся на сложных техниках окрашивания: балаяж, шатуш, air touch. Индивидуальный подбор оттенка для каждого клиента.'
  },
  { 
    icon: 'Hand', 
    title: 'Маникюр', 
    description: 'Классический и аппаратный маникюр с покрытием',
    details: 'Профессиональный маникюр с использованием стерильных инструментов. Большой выбор качественных гель-лаков. Укрепление и восстановление ногтевой пластины.'
  },
  { 
    icon: 'Smile', 
    title: 'Косметология', 
    description: 'Уходовые процедуры для лица и тела',
    details: 'Чистки, пилинги, массаж лица, anti-age программы. Работаем на профессиональной косметике ведущих брендов. Индивидуальный подход к каждому типу кожи.'
  },
  { 
    icon: 'Wand2', 
    title: 'Брови и ресницы', 
    description: 'Оформление бровей, ламинирование ресниц',
    details: 'Архитектура бровей с окрашиванием, коррекция формы. Ламинирование и наращивание ресниц. Долговременная укладка бровей.'
  },
  { 
    icon: 'User', 
    title: 'Массаж', 
    description: 'Расслабляющий и оздоровительный массаж',
    details: 'Классический, лимфодренажный, антицеллюлитный массаж. Опытные специалисты помогут снять напряжение и улучшить самочувствие.'
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши услуги
          </h1>
          <p className="text-lg text-gray-600">
            Полный спектр услуг для красоты и здоровья. Профессиональные мастера, 
            качественные материалы и индивидуальный подход к каждому клиенту.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name={service.icon as any} size={32} className="text-white" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{service.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Не нашли нужную услугу? Свяжитесь с нами для консультации!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/booking" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Icon name="Calendar" size={20} className="mr-2" />
              Записаться онлайн
            </a>
            <a href="/contacts" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg">
              <Icon name="Phone" size={20} className="mr-2" />
              Связаться с нами
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
