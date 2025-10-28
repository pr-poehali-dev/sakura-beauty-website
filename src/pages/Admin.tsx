import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { api, Booking, Review, Feedback } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [bookingsRes, reviewsRes, feedbackRes] = await Promise.all([
        api.getBookings(),
        api.getReviews(),
        api.getFeedback(),
      ]);
      setBookings(bookingsRes.bookings);
      setReviews(reviewsRes.reviews);
      setFeedback(feedbackRes.feedback);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (id: number, status: string) => {
    try {
      await api.updateBooking(id, status);
      toast({
        title: 'Запись обновлена',
        description: `Статус изменён на: ${status}`,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить запись',
        variant: 'destructive',
      });
    }
  };

  const handleApproveReview = async (id: number, approved: boolean) => {
    try {
      await api.approveReview(id, approved);
      toast({
        title: approved ? 'Отзыв одобрен' : 'Отзыв отклонён',
        description: approved ? 'Отзыв теперь виден на сайте' : 'Отзыв скрыт с сайта',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв',
        variant: 'destructive',
      });
    }
  };

  const handleMarkFeedbackAsRead = async (id: number, is_read: boolean) => {
    try {
      await api.markFeedbackAsRead(id, is_read);
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

  if (!user || user.role !== 'admin') return null;

  const stats = {
    totalBookings: bookings.length,
    pendingReviews: reviews.filter(r => !r.approved).length,
    unreadFeedback: feedback.filter(f => !f.is_read).length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
  };

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
                <h1 className="text-2xl font-bold">Административная панель</h1>
                <p className="text-sm text-muted-foreground">Управление салоном Сакура</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/cabinet')}>
                <Icon name="User" size={18} className="mr-2" />
                Личный кабинет
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
              <Icon name="Calendar" className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Активные записи</CardTitle>
              <Icon name="CheckCircle" className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Новые отзывы</CardTitle>
              <Icon name="MessageSquare" className="text-accent" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Непрочитанные</CardTitle>
              <Icon name="Mail" className="text-destructive" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadFeedback}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">
              Записи ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Отзывы ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="feedback">
              Обратная связь ({feedback.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Управление записями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Записей пока нет</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {booking.client_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {booking.phone}
                              </p>
                            </div>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'cancelled' ? 'destructive' :
                              'secondary'
                            }>
                              {booking.status === 'confirmed' ? 'Подтверждена' :
                               booking.status === 'cancelled' ? 'Отменена' :
                               'Завершена'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Услуга</p>
                              <p className="font-medium">{booking.service}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Мастер</p>
                              <p className="font-medium">{booking.master}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Дата</p>
                              <p className="font-medium">
                                {new Date(booking.booking_date).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Время</p>
                              <p className="font-medium">{booking.booking_time}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {booking.status !== 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateBooking(booking.id, 'completed')}
                              >
                                <Icon name="Check" size={16} className="mr-2" />
                                Завершить
                              </Button>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateBooking(booking.id, 'cancelled')}
                              >
                                <Icon name="X" size={16} className="mr-2" />
                                Отменить
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Модерация отзывов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Отзывов пока нет</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <Card key={review.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{review.author}</h3>
                              <div className="flex gap-1 mb-2">
                                {[...Array(review.rating)].map((_, i) => (
                                  <span key={i}>⭐</span>
                                ))}
                              </div>
                            </div>
                            <Badge variant={review.approved ? 'default' : 'secondary'}>
                              {review.approved ? 'Опубликован' : 'На модерации'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">"{review.comment}"</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Дата: {new Date(review.created_at).toLocaleDateString('ru-RU')}
                          </p>
                          <div className="flex gap-2">
                            {!review.approved ? (
                              <Button
                                size="sm"
                                onClick={() => handleApproveReview(review.id, true)}
                              >
                                <Icon name="Check" size={16} className="mr-2" />
                                Одобрить
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReview(review.id, false)}
                              >
                                <Icon name="X" size={16} className="mr-2" />
                                Скрыть
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Обратная связь</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Mail" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Сообщений пока нет</p>
                    </div>
                  ) : (
                    feedback.map((item) => (
                      <Card key={item.id} className={`border-2 ${!item.is_read ? 'bg-primary/5' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.phone}</p>
                            </div>
                            <Badge variant={item.is_read ? 'secondary' : 'default'}>
                              {item.is_read ? 'Прочитано' : 'Новое'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{item.message}</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Дата: {new Date(item.created_at).toLocaleDateString('ru-RU')}
                          </p>
                          {!item.is_read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkFeedbackAsRead(item.id, true)}
                            >
                              <Icon name="Check" size={16} className="mr-2" />
                              Отметить как прочитанное
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default Admin;
