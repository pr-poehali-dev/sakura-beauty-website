import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const masters = [
  { 
    name: 'Анна Петрова', 
    specialty: 'Стилист-колорист', 
    experience: '8 лет опыта',
    description: 'Специализируется на сложных техниках окрашивания: балаяж, шатуш, air touch. Постоянно совершенствует навыки на международных курсах.',
    skills: ['Окрашивание', 'Стрижки', 'Укладки']
  },
  { 
    name: 'Мария Иванова', 
    specialty: 'Мастер маникюра', 
    experience: '5 лет опыта',
    description: 'Профессионал в области ногтевого сервиса. Владеет всеми видами маникюра и художественной росписи. Работает только с премиум-материалами.',
    skills: ['Маникюр', 'Педикюр', 'Дизайн ногтей']
  },
  { 
    name: 'Елена Сидорова', 
    specialty: 'Косметолог', 
    experience: '10 лет опыта',
    description: 'Сертифицированный косметолог с медицинским образованием. Специализируется на anti-age программах и аппаратной косметологии.',
    skills: ['Чистки', 'Пилинги', 'Массаж лица']
  },
  { 
    name: 'Ольга Морозова', 
    specialty: 'Массажист', 
    experience: '7 лет опыта',
    description: 'Опытный специалист по различным видам массажа. Индивидуальный подход к каждому клиенту с учетом особенностей организма.',
    skills: ['Классический массаж', 'Лимфодренаж', 'Антицеллюлитный']
  },
  { 
    name: 'Дарья Новикова', 
    specialty: 'Бровист', 
    experience: '4 года опыта',
    description: 'Мастер по оформлению бровей и ресниц. Создает идеальную форму бровей с учетом особенностей лица. Сертифицированный специалист по ламинированию.',
    skills: ['Архитектура бровей', 'Ламинирование', 'Окрашивание']
  },
  { 
    name: 'Виктория Соколова', 
    specialty: 'Стилист', 
    experience: '6 лет опыта',
    description: 'Креативный стилист, следящий за последними трендами в индустрии красоты. Специализируется на стрижках любой сложности.',
    skills: ['Женские стрижки', 'Мужские стрижки', 'Укладки']
  },
];

export default function Masters() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши мастера
          </h1>
          <p className="text-lg text-gray-600">
            Команда профессионалов с многолетним опытом работы. Каждый мастер регулярно 
            повышает квалификацию и следит за последними тенденциями в индустрии красоты.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {masters.map((master, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16 bg-gradient-to-br from-pink-400 to-purple-500">
                    <AvatarFallback className="text-white text-xl font-semibold">
                      {master.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{master.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-pink-600">
                      {master.specialty}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Icon name="Award" size={16} className="mr-2" />
                  {master.experience}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">{master.description}</p>
                <div className="flex flex-wrap gap-2">
                  {master.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Хотите записаться к конкретному мастеру?
          </p>
          <a 
            href="/booking" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Icon name="Calendar" size={20} className="mr-2" />
            Записаться на услугу
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
