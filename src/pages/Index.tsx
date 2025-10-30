import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'Users',
    title: 'Опытные мастера',
    description: 'Профессионалы с многолетним опытом и постоянным повышением квалификации'
  },
  {
    icon: 'Award',
    title: 'Качественные материалы',
    description: 'Используем только премиум-косметику и профессиональное оборудование'
  },
  {
    icon: 'Heart',
    title: 'Индивидуальный подход',
    description: 'Учитываем особенности каждого клиента и его пожелания'
  },
  {
    icon: 'Shield',
    title: 'Безопасность',
    description: 'Стерильные инструменты и соблюдение всех санитарных норм'
  },
];

const services = [
  { 
    icon: 'Scissors', 
    title: 'Стрижки', 
    description: 'Женские, мужские и детские стрижки'
  },
  { 
    icon: 'Sparkles', 
    title: 'Окрашивание', 
    description: 'Все виды окрашивания волос'
  },
  { 
    icon: 'Hand', 
    title: 'Маникюр', 
    description: 'Классический и аппаратный'
  },
  { 
    icon: 'Smile', 
    title: 'Косметология', 
    description: 'Уходовые процедуры для лица'
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Салон красоты <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Сакура</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ваша красота — наша страсть. Профессиональные услуги красоты в уютной атмосфере
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-lg px-8 py-6"
                onClick={() => window.location.href = '/booking'}
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                Записаться онлайн
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => window.location.href = '/services'}
              >
                Наши услуги
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name={feature.icon as any} size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Популярные услуги
            </h2>
            <p className="text-lg text-gray-600">
              Полный спектр услуг для вашей красоты
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-pink-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name={service.icon as any} size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/services'}
            >
              Все услуги
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0 overflow-hidden">
            <CardContent className="p-12">
              <Icon name="Sparkles" size={48} className="mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Готовы преобразиться?
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Запишитесь на процедуру прямо сейчас и получите особые условия для новых клиентов
              </p>
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => window.location.href = '/booking'}
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                Записаться онлайн
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
