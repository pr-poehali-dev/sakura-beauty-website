import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold">Сакура</span>
            </div>
            <p className="text-gray-400">
              Салон красоты премиум-класса в центре города
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Главная
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Услуги
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/masters')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Мастера
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/price')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Прайс-лист
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Стрижки</li>
              <li>Окрашивание</li>
              <li>Маникюр</li>
              <li>Косметология</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Icon name="MapPin" size={16} className="mr-2" />
                г. Москва, ул. Примерная, 123
              </li>
              <li className="flex items-center">
                <Icon name="Phone" size={16} className="mr-2" />
                +7 (999) 123-45-67
              </li>
              <li className="flex items-center">
                <Icon name="Mail" size={16} className="mr-2" />
                info@sakura-salon.ru
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Салон красоты Сакура. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
