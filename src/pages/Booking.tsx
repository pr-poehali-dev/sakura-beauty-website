import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const services = [
  'Женская стрижка',
  'Мужская стрижка',
  'Окрашивание',
  'Мелирование',
  'Маникюр',
  'Педикюр',
  'Косметология',
  'Массаж',
  'Брови и ресницы',
];

const masters = [
  'Анна Петрова',
  'Мария Иванова',
  'Елена Сидорова',
  'Ольга Морозова',
  'Дарья Новикова',
  'Виктория Соколова',
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    service: '',
    master: '',
    date: '',
    time: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему, чтобы записаться',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.service || !formData.date || !formData.time) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Выберите услугу, дату и время',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.createBooking({
        service: formData.service,
        master: formData.master || 'Любой мастер',
        booking_date: `${formData.date} ${formData.time}`,
        comment: formData.comment,
      });

      if (response.success) {
        toast({
          title: 'Запись создана!',
          description: 'Мы свяжемся с вами для подтверждения',
        });
        setFormData({ service: '', master: '', date: '', time: '', comment: '' });
        navigate('/cabinet');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись',
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
            Онлайн-запись
          </h1>
          <p className="text-lg text-gray-600">
            Выберите удобное время и запишитесь на процедуру прямо сейчас
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl">Форма записи</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="service">Услуга *</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="master">Мастер (необязательно)</Label>
                  <Select value={formData.master} onValueChange={(value) => setFormData({ ...formData, master: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой мастер" />
                    </SelectTrigger>
                    <SelectContent>
                      {masters.map((master) => (
                        <SelectItem key={master} value={master}>
                          {master}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Дата *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Время *</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Комментарий (необязательно)</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Дополнительные пожелания..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-lg py-6"
                  disabled={isSubmitting || !user}
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : user ? (
                    <>
                      <Icon name="Calendar" size={20} className="mr-2" />
                      Записаться
                    </>
                  ) : (
                    'Войдите для записи'
                  )}
                </Button>
              </form>

              {!user && (
                <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-sm text-gray-700 text-center">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Для онлайн-записи необходимо войти в систему или зарегистрироваться
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}