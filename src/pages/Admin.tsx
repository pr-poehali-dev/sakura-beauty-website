import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { api, Service, User } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [masterDialog, setMasterDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [servicesRes, usersRes] = await Promise.all([
        api.getServices(),
        api.getAllUsers(),
      ]);
      setServices(servicesRes.services);
      setUsers(usersRes.users);
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

  const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.createService({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        duration: Number(formData.get('duration')),
        price: Number(formData.get('price')),
        category: formData.get('category') as string,
      });
      
      toast({ title: 'Успешно', description: 'Услуга добавлена' });
      setServiceDialog(false);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить услугу', variant: 'destructive' });
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      await api.updateService(service);
      toast({ title: 'Успешно', description: 'Услуга обновлена' });
      setEditingService(null);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить услугу', variant: 'destructive' });
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Удалить эту услугу?')) return;
    
    try {
      await api.deleteService(id);
      toast({ title: 'Успешно', description: 'Услуга удалена' });
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить услугу', variant: 'destructive' });
    }
  };

  const handleCreateMaster = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await api.createMaster({
        email: formData.get('email') as string,
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
      });
      
      toast({
        title: 'Мастер добавлен',
        description: `Временный пароль: ${result.temporary_password}`,
      });
      setMasterDialog(false);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить мастера', variant: 'destructive' });
    }
  };

  const handleDeleteMaster = async (id: number) => {
    if (!confirm('Удалить этого мастера?')) return;
    
    try {
      await api.deleteMaster(id);
      toast({ title: 'Успешно', description: 'Мастер удален' });
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить мастера', variant: 'destructive' });
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast({ title: 'Успешно', description: 'Роль изменена' });
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить роль', variant: 'destructive' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const masters = users.filter(u => u.role === 'master');
  const clients = users.filter(u => u.role === 'client');

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
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Управление салоном Сакура</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/cabinet')}>
              <Icon name="User" size={18} className="mr-2" />
              Личный кабинет
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Услуги ({services.length})</TabsTrigger>
            <TabsTrigger value="masters">Мастера ({masters.length})</TabsTrigger>
            <TabsTrigger value="users">Пользователи ({users.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Управление услугами</CardTitle>
                  <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить услугу
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новая услуга</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateService} className="space-y-4">
                        <div>
                          <Label>Название</Label>
                          <Input name="name" required />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea name="description" />
                        </div>
                        <div>
                          <Label>Длительность (мин)</Label>
                          <Input name="duration" type="number" required />
                        </div>
                        <div>
                          <Label>Цена (руб)</Label>
                          <Input name="price" type="number" required />
                        </div>
                        <div>
                          <Label>Категория</Label>
                          <Input name="category" />
                        </div>
                        <Button type="submit" className="w-full">Создать</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span>{service.duration} мин</span>
                              <span className="font-bold">{service.price} ₽</span>
                              {service.category && <span className="text-primary">{service.category}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="masters">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Мастера салона</CardTitle>
                  <Dialog open={masterDialog} onOpenChange={setMasterDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить мастера
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый мастер</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateMaster} className="space-y-4">
                        <div>
                          <Label>Имя</Label>
                          <Input name="full_name" required />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input name="email" type="email" required />
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input name="phone" />
                        </div>
                        <Button type="submit" className="w-full">Создать</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {masters.map((master) => (
                    <Card key={master.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{master.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{master.email}</p>
                            {master.phone && <p className="text-sm">{master.phone}</p>}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMaster(master.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((u) => (
                    <Card key={u.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{u.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                            {u.phone && <p className="text-sm">{u.phone}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Роль:</Label>
                            <Select
                              value={u.role}
                              onValueChange={(role) => handleUpdateUserRole(u.id, role)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="client">Клиент</SelectItem>
                                <SelectItem value="master">Мастер</SelectItem>
                                <SelectItem value="admin">Админ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
