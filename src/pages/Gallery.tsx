import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const galleryCategories = [
  {
    id: 'hair',
    name: 'Волосы',
    items: [
      { title: 'Балаяж на темные волосы', color: 'from-amber-900 to-amber-600' },
      { title: 'Стрижка боб', color: 'from-rose-900 to-rose-600' },
      { title: 'Окрашивание омбре', color: 'from-purple-900 to-pink-500' },
      { title: 'Мужская стрижка', color: 'from-gray-900 to-gray-600' },
      { title: 'Свадебная укладка', color: 'from-pink-200 to-pink-400' },
      { title: 'Мелирование', color: 'from-yellow-600 to-yellow-300' },
    ]
  },
  {
    id: 'nails',
    name: 'Маникюр',
    items: [
      { title: 'Французский маникюр', color: 'from-pink-100 to-white' },
      { title: 'Дизайн с блестками', color: 'from-purple-400 to-pink-400' },
      { title: 'Минималистичный дизайн', color: 'from-gray-100 to-gray-300' },
      { title: 'Яркий летний маникюр', color: 'from-orange-400 to-yellow-400' },
      { title: 'Геометрический дизайн', color: 'from-blue-400 to-purple-400' },
      { title: 'Нюдовый маникюр', color: 'from-pink-200 to-pink-300' },
    ]
  },
  {
    id: 'brows',
    name: 'Брови',
    items: [
      { title: 'Архитектура бровей', color: 'from-amber-800 to-amber-600' },
      { title: 'Окрашивание хной', color: 'from-orange-900 to-orange-700' },
      { title: 'Ламинирование бровей', color: 'from-yellow-900 to-yellow-700' },
      { title: 'Натуральная форма', color: 'from-amber-700 to-amber-500' },
    ]
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши работы
          </h1>
          <p className="text-lg text-gray-600">
            Примеры работ наших мастеров. Каждая работа выполнена с любовью и вниманием к деталям.
          </p>
        </div>

        <Tabs defaultValue="hair" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            {galleryCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-base">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {galleryCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/30"
                  >
                    <div className={`h-64 bg-gradient-to-br ${item.color} flex items-end p-6`}>
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Хотите получить такой же результат?
          </p>
          <a 
            href="/booking" 
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Записаться на услугу
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}