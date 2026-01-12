import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const priceList = [
  { 
    category: 'Стрижки', 
    icon: 'Scissors',
    items: [
      { name: 'Женская стрижка', price: '1500-2500 ₽', duration: '60 мин' },
      { name: 'Мужская стрижка', price: '800-1200 ₽', duration: '40 мин' },
      { name: 'Детская стрижка', price: '600-900 ₽', duration: '30 мин' },
      { name: 'Укладка', price: '1000-1500 ₽', duration: '40 мин' },
    ]
  },
  { 
    category: 'Окрашивание', 
    icon: 'Sparkles',
    items: [
      { name: 'Окрашивание корней', price: '2000-3000 ₽', duration: '90 мин' },
      { name: 'Полное окрашивание', price: '3500-5500 ₽', duration: '120 мин' },
      { name: 'Мелирование', price: '4000-6000 ₽', duration: '150 мин' },
      { name: 'Балаяж/Шатуш', price: '5000-8000 ₽', duration: '180 мин' },
      { name: 'Тонирование', price: '2500-3500 ₽', duration: '60 мин' },
    ]
  },
  { 
    category: 'Маникюр', 
    icon: 'Hand',
    items: [
      { name: 'Классический маникюр', price: '1200 ₽', duration: '45 мин' },
      { name: 'Аппаратный маникюр', price: '1000 ₽', duration: '40 мин' },
      { name: 'Маникюр с покрытием', price: '1800 ₽', duration: '60 мин' },
      { name: 'Наращивание ногтей', price: '2500 ₽', duration: '120 мин' },
      { name: 'Педикюр', price: '2000 ₽', duration: '60 мин' },
    ]
  },
  { 
    category: 'Косметология', 
    icon: 'Smile',
    items: [
      { name: 'Чистка лица', price: '2500-3500 ₽', duration: '60 мин' },
      { name: 'Пилинг', price: '2000-4000 ₽', duration: '45 мин' },
      { name: 'Массаж лица', price: '1800 ₽', duration: '40 мин' },
      { name: 'Anti-age программа', price: '5000-7000 ₽', duration: '90 мин' },
    ]
  },
  { 
    category: 'Брови и ресницы', 
    icon: 'Wand2',
    items: [
      { name: 'Архитектура бровей', price: '1200 ₽', duration: '40 мин' },
      { name: 'Окрашивание бровей', price: '600 ₽', duration: '20 мин' },
      { name: 'Ламинирование ресниц', price: '2500 ₽', duration: '60 мин' },
      { name: 'Наращивание ресниц', price: '3000-4000 ₽', duration: '120 мин' },
    ]
  },
  { 
    category: 'Массаж', 
    icon: 'User',
    items: [
      { name: 'Классический массаж', price: '2500 ₽', duration: '60 мин' },
      { name: 'Лимфодренажный массаж', price: '3000 ₽', duration: '60 мин' },
      { name: 'Антицеллюлитный массаж', price: '3500 ₽', duration: '60 мин' },
      { name: 'Массаж спины', price: '1800 ₽', duration: '40 мин' },
    ]
  },
];

export default function Price() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Прайс-лист
          </h1>
          <p className="text-lg text-gray-600">
            Прозрачные цены на все услуги. Итоговая стоимость зависит от квалификации мастера 
            и сложности работы. Точную цену вы узнаете после консультации.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {priceList.map((category, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name={category.icon as any} size={24} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Icon name="Clock" size={14} className="mr-1" />
                          {item.duration}
                        </p>
                      </div>
                      <p className="font-semibold text-primary ml-4 whitespace-nowrap">{item.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="bg-primary/10 border-2 border-primary/30">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Icon name="Info" size={24} className="text-primary mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">Важная информация</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Цены указаны ориентировочно и могут меняться в зависимости от сложности работы</li>
                    <li>• Консультация специалиста перед процедурой — бесплатно</li>
                    <li>• Действует система скидок для постоянных клиентов</li>
                    <li>• Возможна оплата картой и безналичным расчетом</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Готовы записаться на процедуру?
          </p>
          <a 
            href="/booking" 
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Icon name="Calendar" size={20} className="mr-2" />
            Записаться онлайн
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}