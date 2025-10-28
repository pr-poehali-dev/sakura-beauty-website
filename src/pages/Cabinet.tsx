import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { api, Booking } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

function Cabinet() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const result = await api.getBookings();
      setBookings(result.bookings);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить записи',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    try {
      await api.updateBooking(id, 'cancelled');
      toast({
        title: 'Запись отменена',
        description: 'Вы можете создать новую запись в любое время',
      });
      loadBookings();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить запись',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'secondary',
    };
    const labels: Record<string, string> = {
      confirmed: 'Подтверждена',
      cancelled: 'Отменена',
      completed: 'Завершена',
    };
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Личный кабинет</h1>
                <p className="text-sm text-muted-foreground">{user.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <Icon name="Settings" size={18} className="mr-2" />
                  Админ-панель
                </Button>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Имя</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Роль</p>
                  <Badge>{user.role === 'admin' ? 'Администратор' : 'Клиент'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать запись
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая запись</DialogTitle>
                    </DialogHeader>
                    <BookingFormInCabinet onSuccess={loadBookings} />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Icon name="MessageSquare" size={18} className="mr-2" />
                      Оставить отзыв
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Оставить отзыв</DialogTitle>
                    </DialogHeader>
                    <ReviewForm />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Мои записи</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">У вас пока нет записей</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <Icon name="Plus" size={18} className="mr-2" />
                          Создать первую запись
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Новая запись</DialogTitle>
                        </DialogHeader>
                        <BookingFormInCabinet onSuccess={loadBookings} />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">Мастер: {booking.master}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Дата</p>
                              <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Время</p>
                              <p className="font-medium">{booking.booking_time}</p>
                            </div>
                          </div>
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <Icon name="X" size={16} className="mr-2" />
                              Отменить запись
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function BookingFormInCabinet({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      client_name: user?.full_name || '',
      phone: user?.phone || formData.get('phone') as string,
      service: formData.get('service') as string,
      master: formData.get('master') as string,
      booking_date: formData.get('date') as string,
      booking_time: formData.get('time') as string,
    };

    const result = await api.createBooking(data);
    setLoading(false);
    
    if (result.success) {
      toast({
        title: 'Запись создана!',
        description: 'Мы ждём вас в назначенное время',
      });
      onSuccess();
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись',
        variant: 'destructive',
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="service">Услуга</Label>
        <select name="service" id="service" required className="w-full border rounded-md p-2">
          <option value="">Выберите услугу</option>
          <option value="Стрижка">Стрижка</option>
          <option value="Окрашивание">Окрашивание</option>
          <option value="Маникюр">Маникюр</option>
          <option value="Косметология">Косметология</option>
          <option value="Брови и ресницы">Брови и ресницы</option>
          <option value="Массаж">Массаж</option>
        </select>
      </div>
      <div>
        <Label htmlFor="master">Мастер</Label>
        <select name="master" id="master" required className="w-full border rounded-md p-2">
          <option value="">Выберите мастера</option>
          <option value="Анна Петрова">Анна Петрова</option>
          <option value="Мария Иванова">Мария Иванова</option>
          <option value="Елена Сидорова">Елена Сидорова</option>
          <option value="Ольга Морозова">Ольга Морозова</option>
        </select>
      </div>
      <div>
        <Label htmlFor="date">Дата</Label>
        <Input id="date" name="date" type="date" required />
      </div>
      <div>
        <Label htmlFor="time">Время</Label>
        <select name="time" id="time" required className="w-full border rounded-md p-2">
          <option value="">Выберите время</option>
          {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Создание...' : 'Создать запись'}
      </Button>
    </form>
  );
}

function ReviewForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      author: user?.full_name || '',
      rating,
      comment: formData.get('comment') as string,
    };

    const result = await api.createReview(data);
    setLoading(false);
    
    if (result.success) {
      toast({
        title: 'Отзыв отправлен!',
        description: 'Спасибо за ваш отзыв! Он появится после модерации.',
      });
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв',
        variant: 'destructive',
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label>Оценка</Label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl transition-all"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment">Отзыв</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Расскажите о вашем опыте..."
          rows={4}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить отзыв'}
      </Button>
    </form>
  );
}

export default Cabinet;
