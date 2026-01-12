import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const initialReviews = [
  { 
    author: 'Екатерина', 
    text: 'Прекрасный салон! Мастера настоящие профессионалы. Хожу сюда уже год и всегда довольна результатом.', 
    rating: 5,
    date: '15 октября 2024'
  },
  { 
    author: 'Наталья', 
    text: 'Очень уютная атмосфера и внимательное отношение. Маникюр держится 3 недели без сколов!', 
    rating: 5,
    date: '10 октября 2024'
  },
  { 
    author: 'Ирина', 
    text: 'Делала окрашивание у Анны - результат превзошел ожидания! Волосы живые и блестящие.', 
    rating: 5,
    date: '5 октября 2024'
  },
  { 
    author: 'Светлана', 
    text: 'Отличный сервис и профессиональные мастера. Особенно понравилась чистка лица у косметолога Елены.', 
    rating: 5,
    date: '1 октября 2024'
  },
  { 
    author: 'Анна', 
    text: 'Хожу в салон уже полгода. Всегда довольна качеством услуг и приятной атмосферой. Рекомендую!', 
    rating: 5,
    date: '28 сентября 2024'
  },
];

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему, чтобы оставить отзыв',
        variant: 'destructive',
      });
      return;
    }

    if (!newReview.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Напишите текст отзыва',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.createReview({
        rating,
        comment: newReview,
      });

      if (response.success) {
        toast({
          title: 'Отзыв отправлен!',
          description: 'Спасибо за ваш отзыв. Он появится после модерации.',
        });
        setNewReview('');
        setRating(5);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Отзывы клиентов
          </h1>
          <p className="text-lg text-gray-600">
            Мы ценим мнение каждого клиента и постоянно работаем над улучшением качества услуг.
          </p>
        </div>

        {user && (
          <Card className="max-w-3xl mx-auto mb-12 border-2 border-primary/30">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Оставьте свой отзыв</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваша оценка
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Icon 
                        name={star <= rating ? 'Star' : 'Star'} 
                        size={32} 
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваш отзыв
                </label>
                <Textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Расскажите о вашем опыте посещения салона..."
                  className="min-h-32"
                />
              </div>
              <Button 
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full bg-primary"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12 bg-primary">
                    <AvatarFallback className="text-white font-semibold">
                      {review.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{review.author}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!user && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Хотите оставить отзыв? Войдите в систему или зарегистрируйтесь
            </p>
            <Button className="bg-primary">
              Войти
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}