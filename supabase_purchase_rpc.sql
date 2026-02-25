-- Create RPC function to handle purchases safely
CREATE OR REPLACE FUNCTION purchase_moo_item(item_id TEXT, cost INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges to update profile
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- 1. Get current balance
  SELECT COALESCE(moo_points, 0) INTO current_balance 
  FROM public.user_profiles 
  WHERE user_id = auth.uid();
  
  -- 2. Check funds
  IF current_balance < cost THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient funds');
  END IF;

  -- 3. Deduct points
  UPDATE public.user_profiles 
  SET moo_points = moo_points - cost 
  WHERE user_id = auth.uid()
  RETURNING moo_points INTO new_balance;

  -- 4. Return success
  RETURN jsonb_build_object('success', true, 'new_balance', new_balance);
END;
$$;
