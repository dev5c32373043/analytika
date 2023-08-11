import { AuthService } from './auth.service';
import { ReportsService } from './reports.service';
import { ActivitiesService } from './activities.service';
import { CustomerService } from './customer.service';

export const authService = new AuthService();
export const reportsService = new ReportsService();
export const activitiesService = new ActivitiesService();
export const customerService = new CustomerService();
